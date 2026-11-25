---
name: renew-ssl
description: Renew the luminia.be HTTPS certificate (Let's Encrypt wildcard for luminia.be + *.luminia.be). Walks the user through certbot in WSL, the GoDaddy DNS TXT challenge, uploading the PEM files in the hosting panel, and checks each step from here. Use when the user wants to renew/update/replace the SSL/HTTPS/TLS certificate, or asks when it expires.
---

# Renew the luminia.be certificate

The certificate is a Let's Encrypt wildcard (`luminia.be` + `*.luminia.be`), valid for 90 days. Nothing in the repo configures TLS: the host (IIS 10) serves the certificate, and the user uploads it through their hosting control panel. There's no access to the server, so don't suggest IIS Manager, win-acme or anything server-side.

The user runs the interactive steps (certbot waits for Enter presses, GoDaddy and the hosting panel need their login). Your job is to give each step in order, wait for them, and **check the result from here** with the PowerShell commands below. Go one step at a time: don't dump the whole procedure at once.

## 0. Check the current certificate

```powershell
$h='luminia.be'; $t=New-Object Net.Sockets.TcpClient($h,443); $s=New-Object Net.Security.SslStream($t.GetStream(),$false,{$true}); try { $s.AuthenticateAsClient($h); $c=New-Object Security.Cryptography.X509Certificates.X509Certificate2($s.RemoteCertificate); "Issuer: $($c.Issuer)"; "Valid:  $($c.NotBefore) -> $($c.NotAfter)"; "Days left: $([int]($c.NotAfter-(Get-Date)).TotalDays)" } finally { $s.Dispose(); $t.Close() }
```

Tell the user the expiry date and how many days are left. More than ~30 days left: say renewal isn't needed yet and ask whether to go ahead anyway.

## 1. Run certbot (user, in Ubuntu/WSL)

Tell them to open **Ubuntu** (Start menu, or `wsl` in PowerShell) and run:

```
sudo certbot certonly --manual --preferred-challenges=dns --key-type rsa --rsa-key-size 4096 -d luminia.be -d '*.luminia.be'
```

- Keep the quotes around `'*.luminia.be'` (without them the shell may expand the `*`).
- If certbot asks to renew or replace the existing certificate, choose **renew**.
- It shows a TXT value and waits. **Don't press Enter yet.**

## 2. Add the DNS challenge records (user, in GoDaddy)

GoDaddy → Account → domain luminia.be → **DNS**. Add a record:

- Type **TXT**, Name **`_acme-challenge`**, Value = the value certbot showed, TTL **1 hour**.

Then press Enter in certbot; it shows a **second** value. Add it as a second TXT record with the same name. Don't delete any other records.

When they say both are added, check them before they press Enter the last time. Query GoDaddy's own nameserver first (it updates immediately), then Google:

```powershell
$ns=(Resolve-DnsName -Type NS luminia.be -Server 8.8.8.8 | ? Type -eq 'NS' | select -First 1).NameHost; foreach ($srv in $ns,'8.8.8.8') { "--- $srv"; try { Resolve-DnsName -Type TXT _acme-challenge.luminia.be -Server $srv -DnsOnly -ErrorAction Stop | ? Type -eq 'TXT' | % { $_.Strings } } catch { 'none' } }
```

Both new values must show up (old values from a previous renewal may show up too; that's fine). Then tell them to press Enter. The user's own fallback is https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.luminia.be

If certbot fails validation, it's almost always that the records weren't visible yet: wait a few minutes, re-run the check, and run certbot again (it gives new values).

## 3. Copy the files to Windows (user, in Ubuntu)

Have them check the "Certificate is saved at:" line. Normally it's `/etc/letsencrypt/live/luminia.be/`; if it says `luminia.be-0001`, use that folder name below.

```
mkdir -p /mnt/c/Users/woute/Desktop/luminia-ssl
sudo cp /etc/letsencrypt/live/luminia.be/{fullchain,privkey,chain}.pem /mnt/c/Users/woute/Desktop/luminia-ssl/
```

## 4. Upload in the hosting panel (user)

On the panel's SSL page, paste each file's full contents (including the `-----BEGIN/END-----` lines):

- `privkey.pem` → **Private Key**
- `fullchain.pem` → **Certificate** (if the panel complains about a duplicate chain or multiple certificates, use `cert.pem` from the same folder instead)
- `chain.pem` → **CA certificate**

Save, and make sure luminia.be is set to **use** the new certificate (uploading often only adds it to a list).

## 5. Verify the live site

```powershell
foreach ($h in 'luminia.be','www.luminia.be') { $t=New-Object Net.Sockets.TcpClient($h,443); $s=New-Object Net.Security.SslStream($t.GetStream(),$false); try { $s.AuthenticateAsClient($h); $c=New-Object Security.Cryptography.X509Certificates.X509Certificate2($s.RemoteCertificate); "$h : trusted, valid $($c.NotBefore) -> $($c.NotAfter), $($c.PublicKey.Key.KeySize)-bit, $(($c.Extensions | ? { $_.Oid.FriendlyName -eq 'Subject Alternative Name' }).Format($false))" } catch { "$h : FAILED $($_.Exception.InnerException.Message) $($_.Exception.Message)" } finally { $s.Dispose(); $t.Close() } }
```

Expect: trusted (no validation error), issued today, expiring ~90 days from now, 4096-bit, both names covered. If it still shows the old dates, the panel isn't using the new certificate yet (step 4, last line).

## 6. Clean up

- Delete the `luminia-ssl` folder from the Desktop: it holds the private key.
- In GoDaddy, delete **every** TXT record named `_acme-challenge` (new and old). Leave all other records alone (A, CNAME, MX, other TXT like SPF/verification).

When they're done, confirm the records are gone at GoDaddy's nameserver and that the site still answers:

```powershell
$ns=(Resolve-DnsName -Type NS luminia.be -Server 8.8.8.8 | ? Type -eq 'NS' | select -First 1).NameHost; foreach ($srv in $ns,'8.8.8.8') { "--- $srv"; try { $r=Resolve-DnsName -Type TXT _acme-challenge.luminia.be -Server $srv -DnsOnly -ErrorAction Stop | ? Type -eq 'TXT'; if ($r) { $r | % { $_.Strings } } else { 'gone' } } catch { 'gone' } }; "site: $((Invoke-WebRequest https://luminia.be -UseBasicParsing -Method Head).StatusCode)"
```

Gone at GoDaddy's nameserver but still at 8.8.8.8 is just caching (up to the 1 h TTL).

## 7. Wrap up

Tell the user the new expiry date and to renew again a week or two before it. Update the expiry in the `ssl-certificate-renewal` memory if it exists.
