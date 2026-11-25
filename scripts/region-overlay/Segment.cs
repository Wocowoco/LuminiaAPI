using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Text;

public static class Segment
{
    public static string[] Names = { "Aritunn", "Chorne Derev", "North Paikka", "Tikushi", "Myrill", "South Paikka", "Alodia", "Rilsonia", "Sinawiran", "Kewara" };
    public static int[][] Border = {
        new[]{117,78,34}, new[]{49,47,48}, new[]{223,144,6}, new[]{85,210,42}, new[]{75,142,16},
        new[]{250,244,245}, new[]{60,29,219}, new[]{190,24,235}, new[]{192,40,56}, new[]{248,200,44} };
    public static int[] Tol = { 30, 18, 40, 40, 30, 14, 45, 45, 40, 40 };
    static readonly int[] Sea = { 55, 87, 144 };

    public static int W, H;
    static byte[] px;
    public static int[] cls;     // -2 sea, -1 land, k border colour k
    public static int[] region;  // -1 none, k region

    static int Dist2(int r, int g, int b, int[] c) { int dr = r - c[0], dg = g - c[1], db = b - c[2]; return dr * dr + dg * dg + db * db; }

    public static void Load(string path, double scale)
    {
        using (var src = Image.FromFile(path))
        {
            W = (int)Math.Round(src.Width * scale); H = (int)Math.Round(src.Height * scale);
            using (var b = new Bitmap(W, H, PixelFormat.Format32bppArgb))
            {
                using (var g = Graphics.FromImage(b))
                {
                    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.NearestNeighbor;
                    g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.Half;
                    g.DrawImage(src, new Rectangle(0, 0, W, H));
                }
                var d = b.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                px = new byte[d.Stride * H]; Marshal.Copy(d.Scan0, px, 0, px.Length); b.UnlockBits(d);
            }
        }
    }

    // Seeds in full-resolution region-map pixels: {region, x, y}. The land area holding a seed always
    // goes to that region, whatever its border contacts say.
    public static int[][] Seeds = new int[0][];
    static int Find(int[] parent, int a) { while (parent[a] != a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; }

    public static string Run(int minLine, int minArea, int minContact, int grow)
    {
        var sb = new StringBuilder();
        int N = W * H;
        cls = new int[N];
        for (int i = 0; i < N; i++)
        {
            int b = px[i * 4], g = px[i * 4 + 1], r = px[i * 4 + 2];
            if (Dist2(r, g, b, Sea) < 18 * 18) { cls[i] = -2; continue; }
            int best = -1, bd = int.MaxValue;
            for (int k = 0; k < Border.Length; k++)
            {
                int d2 = Dist2(r, g, b, Border[k]);
                if (d2 < Tol[k] * Tol[k] && d2 < bd) { bd = d2; best = k; }
            }
            cls[i] = best;
        }

        // Drop small border-coloured specks (terrain that happens to match): keep long lines only.
        var seen = new bool[N]; var q = new int[N];
        for (int s = 0; s < N; s++)
        {
            if (seen[s] || cls[s] < 0) continue;
            int k = cls[s], head = 0, tail = 0; q[tail++] = s; seen[s] = true;
            while (head < tail)
            {
                int i = q[head++], x = i % W, y = i / W;
                for (int dy = -1; dy <= 1; dy++) for (int dx = -1; dx <= 1; dx++)
                {
                    int nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
                    int j = ny * W + nx; if (seen[j] || cls[j] != k) continue; seen[j] = true; q[tail++] = j;
                }
            }
            if (tail < minLine) for (int t = 0; t < tail; t++) cls[q[t]] = -1;
        }

        // Land areas between the lines; each goes to the border colour it touches most.
        region = new int[N]; for (int i = 0; i < N; i++) region[i] = -1;
        var seedAt = new Dictionary<int, int>();
        foreach (var sd in Seeds)
        {
            int sx = sd[1] * W / 18072, sy = sd[2] * H / 13753, found = -1;
            for (int r = 0; r < 40 && found < 0; r++)
                for (int dy = -r; dy <= r && found < 0; dy++) for (int dx = -r; dx <= r && found < 0; dx++)
                {
                    int x = sx + dx, y = sy + dy; if (x < 0 || y < 0 || x >= W || y >= H) continue;
                    if (cls[y * W + x] == -1) found = y * W + x;
                }
            if (found >= 0) seedAt[found] = sd[0]; else sb.AppendFormat("seed for {0} found no land\n", Names[sd[0]]);
        }
        Array.Clear(seen, 0, N);
        int areas = 0, assigned = 0;
        for (int s = 0; s < N; s++)
        {
            if (seen[s] || cls[s] != -1) continue;
            var contact = new long[Border.Length];
            int head = 0, tail = 0; q[tail++] = s; seen[s] = true;
            while (head < tail)
            {
                int i = q[head++], x = i % W, y = i / W;
                int[] nb = { x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1 };
                foreach (int j in nb)
                {
                    if (j < 0) continue;
                    if (cls[j] >= 0) { contact[cls[j]]++; continue; }
                    if (cls[j] != -1 || seen[j]) continue;
                    seen[j] = true; q[tail++] = j;
                }
            }
            areas++;
            int seeded = -1;
            for (int t = 0; t < tail; t++) { int sr; if (seedAt.TryGetValue(q[t], out sr)) { seeded = sr; break; } }
            int best = -1; long bc = 0, total = 0;
            for (int k = 0; k < contact.Length; k++) { total += contact[k]; if (contact[k] > bc) { bc = contact[k]; best = k; } }
            if (seeded >= 0) best = seeded;
            else
            {
                if (tail < minArea) continue;
                // A clear majority only: islands without a border of their own stay unassigned.
                if (best < 0 || bc < minContact || bc * 2 < total) continue;
            }
            for (int t = 0; t < tail; t++) region[q[t]] = best;
            assigned++;
        }
        sb.AppendFormat("land areas {0}, assigned {1}\n", areas, assigned);

        // Grow regions over their border lines, specks and lakes, never into the sea.
        var dist = new int[N]; int h2 = 0, t2 = 0;
        for (int i = 0; i < N; i++) { dist[i] = region[i] >= 0 ? 0 : int.MaxValue; if (region[i] >= 0) q[t2++] = i; }
        while (h2 < t2)
        {
            int i = q[h2++], x = i % W, y = i / W; if (dist[i] >= grow) continue;
            int[] nb = { x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1 };
            foreach (int j in nb)
            {
                if (j < 0 || region[j] >= 0 || cls[j] == -2) continue;
                region[j] = region[i]; dist[j] = dist[i] + 1; q[t2++] = j;
            }
        }

        // Fill holes: any unassigned patch (ponds, river bits, specks) that doesn't touch the image edge
        // and is surrounded by a single region belongs to that region.
        Array.Clear(seen, 0, N);
        int filled = 0;
        for (int s = 0; s < N; s++)
        {
            if (seen[s] || region[s] >= 0) continue;
            int head = 0, tail = 0, owner = -1; bool open = false, mixed = false;
            var around = new int[Border.Length];
            q[tail++] = s; seen[s] = true;
            while (head < tail)
            {
                int i = q[head++], x = i % W, y = i / W;
                if (x == 0 || y == 0 || x == W - 1 || y == H - 1) open = true;
                int[] nb = { x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1 };
                foreach (int j in nb)
                {
                    if (j < 0) continue;
                    if (region[j] >= 0) { around[region[j]]++; if (owner < 0) owner = region[j]; else if (owner != region[j]) mixed = true; continue; }
                    if (seen[j]) continue;
                    seen[j] = true; q[tail++] = j;
                }
            }
            // A small gap between two regions goes to the one around most of it.
            if (!open && mixed && tail < 400)
            {
                mixed = false;
                for (int k = 0; k < around.Length; k++) if (around[k] > around[owner]) owner = k;
            }
            if (open || mixed || owner < 0) continue;
            for (int t = 0; t < tail; t++) region[q[t]] = owner;
            filled++;
        }
        sb.AppendFormat("holes filled {0}\n", filled);

        var size = new long[Border.Length];
        for (int i = 0; i < N; i++) if (region[i] >= 0) size[region[i]]++;
        for (int k = 0; k < Names.Length; k++) sb.AppendFormat("{0,-13} {1,9} px\n", Names[k], size[k]);
        return sb.ToString();
    }

    // Traces every region's outline into rings of points (full-size region-map pixels), simplified with
    // Douglas-Peucker (tolerance in working pixels) and lightly smoothed. Rings smaller than minRingArea
    // working pixels (tiny rocks) are dropped. Writes JSON: { regions: [{ name, color, rings }] }.
    public static string SaveVectors(string path, double tolerance, double minRingArea)
    {
        double f = 18072.0 / W;
        var sb = new StringBuilder();
        sb.Append("{\"regions\":[");
        int totalPts = 0, totalRings = 0;
        var shared = new Dictionary<string, List<double[]>>();
        for (int k = 0; k < Names.Length; k++)
        {
            var rings = Trace(k);
            if (k > 0) sb.Append(',');
            sb.AppendFormat("{{\"name\":\"{0}\",\"color\":[{1},{2},{3}],\"rings\":[", Names[k], Border[k][0], Border[k][1], Border[k][2]);
            bool first = true;
            foreach (var ring in rings)
            {
                if (Math.Abs(Area(ring)) < minRingArea) continue;
                var simple = SimplifyShared(ring, tolerance, shared);
                if (simple.Count < 3) continue;
                if (!first) sb.Append(',');
                first = false;
                sb.Append('[');
                for (int p = 0; p < simple.Count; p++)
                {
                    if (p > 0) sb.Append(',');
                    sb.AppendFormat("[{0},{1}]", (int)Math.Round(simple[p][0] * f), (int)Math.Round(simple[p][1] * f));
                }
                sb.Append(']');
                totalPts += simple.Count; totalRings++;
            }
            sb.Append("]}");
        }
        sb.Append("]}");
        System.IO.File.WriteAllText(path, sb.ToString());
        return string.Format("{0} rings, {1} points, {2} KB", totalRings, totalPts, sb.Length / 1024);
    }

    // Removes a lake from all regions: grows from the seeds (full-size region-map pixels) over smooth water,
    // where each step changes colour by less than stepTol and stays within driftTol of the seed's colour,
    // inside the box {x0, y0, x1, y1}. Then closes gaps up to 2*close working pixels wide (the border lines
    // drawn across the water) and makes all of it unowned, like the sea.
    public static string CarveLake(int[][] seeds, int[] box, int stepTol, int driftTol, int close)
    {
        int bx0 = box[0] * W / 18072, by0 = box[1] * H / 13753, bx1 = box[2] * W / 18072, by1 = box[3] * H / 13753;
        var lake = new bool[W * H]; var q = new int[W * H];
        foreach (var sd in seeds)
        {
            int sx = sd[0] * W / 18072, sy = sd[1] * H / 13753, s = sy * W + sx;
            if (lake[s]) continue;
            int sr = px[s * 4 + 2], sg = px[s * 4 + 1], sb = px[s * 4];
            int head = 0, tail = 0; q[tail++] = s; lake[s] = true;
            while (head < tail)
            {
                int i = q[head++], x = i % W, y = i / W;
                int r = px[i * 4 + 2], g = px[i * 4 + 1], b = px[i * 4];
                int[] nb = { x > bx0 ? i - 1 : -1, x < bx1 ? i + 1 : -1, y > by0 ? i - W : -1, y < by1 ? i + W : -1 };
                foreach (int j in nb)
                {
                    if (j < 0 || lake[j]) continue;
                    int r2 = px[j * 4 + 2], g2 = px[j * 4 + 1], b2 = px[j * 4];
                    if (Dist2(r2, g2, b2, new[] { r, g, b }) > stepTol * stepTol) continue;
                    if (Dist2(r2, g2, b2, new[] { sr, sg, sb }) > driftTol * driftTol) continue;
                    lake[j] = true; q[tail++] = j;
                }
            }
        }
        // Closing (dilate then erode) with a square of radius `close`, inside the box only.
        var grown = new bool[W * H];
        for (int y = by0; y <= by1; y++) for (int x = bx0; x <= bx1; x++)
        {
            bool any = false;
            for (int dy = -close; dy <= close && !any; dy++) for (int dx = -close; dx <= close && !any; dx++)
            {
                int nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
                any = lake[ny * W + nx];
            }
            grown[y * W + x] = any;
        }
        int removed = 0;
        for (int y = by0; y <= by1; y++) for (int x = bx0; x <= bx1; x++)
        {
            bool all = true;
            for (int dy = -close; dy <= close && all; dy++) for (int dx = -close; dx <= close && all; dx++)
            {
                int nx = x + dx, ny = y + dy; if (nx < bx0 || ny < by0 || nx > bx1 || ny > by1) continue;
                all = grown[ny * W + nx];
            }
            int i = y * W + x;
            if (all || lake[i]) { if (region[i] >= 0) removed++; region[i] = -1; cls[i] = -2; }
        }
        return string.Format("lake removed {0} working px", removed);
    }

    // Hand corrections: every pixel of region `from` inside the polygon (region-map pixels) becomes region `to`.
    // from = -1 matches any region; to = -1 makes it water (owned by nobody).
    public static string Reassign(int[][] polygon, int from, int to)
    {
        double fx = 18072.0 / W, fy = 13753.0 / H; int changed = 0;
        int minX = int.MaxValue, minY = int.MaxValue, maxX = 0, maxY = 0;
        foreach (var p in polygon) { minX = Math.Min(minX, p[0]); minY = Math.Min(minY, p[1]); maxX = Math.Max(maxX, p[0]); maxY = Math.Max(maxY, p[1]); }
        for (int y = (int)(minY / fy); y <= (int)(maxY / fy) && y < H; y++)
            for (int x = (int)(minX / fx); x <= (int)(maxX / fx) && x < W; x++)
            {
                int i = y * W + x; if (region[i] < 0 || (from >= 0 && region[i] != from)) continue;
                double X = (x + 0.5) * fx, Y = (y + 0.5) * fy; bool inPoly = false;
                for (int a = 0, b = polygon.Length - 1; a < polygon.Length; b = a++)
                    if ((polygon[a][1] > Y) != (polygon[b][1] > Y) &&
                        X < (double)(polygon[b][0] - polygon[a][0]) * (Y - polygon[a][1]) / (polygon[b][1] - polygon[a][1]) + polygon[a][0])
                        inPoly = !inPoly;
                if (inPoly) { region[i] = to; changed++; }
            }
        return string.Format("{0} -> {1}: {2} working px", from < 0 ? "any region" : Names[from], to < 0 ? "water" : Names[to], changed);
    }

    // Label of the pixel at (x, y): its region, or -1 for sea, unassigned land and outside the image.
    static int LabelAt(int x, int y) { return x < 0 || y < 0 || x >= W || y >= H ? -1 : region[y * W + x]; }

    // A pixel corner where three or more areas meet (or two meet diagonally). Borders are split at these,
    // so each piece of border between two areas is the same pixel path for both of them.
    static bool IsJunction(int x, int y)
    {
        int a = LabelAt(x - 1, y - 1), b = LabelAt(x, y - 1), c = LabelAt(x - 1, y), d = LabelAt(x, y);
        int distinct = 1;
        if (b != a) distinct++;
        if (c != a && c != b) distinct++;
        if (d != a && d != b && d != c) distinct++;
        if (distinct >= 3) return true;
        return distinct == 2 && a == d && b == c; // checkerboard corner
    }

    // Simplifies a ring so that borders shared with a neighbour come out identical for both regions: the ring
    // is cut at junctions, and each piece is simplified and smoothed once, in a fixed direction, then reused.
    static List<double[]> SimplifyShared(List<double[]> ring, double tol, Dictionary<string, List<double[]>> cache)
    {
        int n = ring.Count;
        var fixedAt = new List<int>();
        for (int i = 0; i < n; i++) if (IsJunction((int)ring[i][0], (int)ring[i][1])) fixedAt.Add(i);
        if (fixedAt.Count == 0) return Smooth(Simplify(ring, tol)); // a coastline-only ring: nobody shares it

        var result = new List<double[]>();
        for (int f = 0; f < fixedAt.Count; f++)
        {
            int start = fixedAt[f], end = fixedAt[(f + 1) % fixedAt.Count];
            var run = new List<double[]>();
            for (int i = start; ; i = (i + 1) % n) { run.Add(ring[i]); if (i == end && run.Count > 1) break; }

            // Canonical direction, so both neighbours simplify the same sequence of points.
            Func<double[], long> key = p => (long)p[1] * (W + 1) + (long)p[0];
            bool reverse = key(run[0]) > key(run[run.Count - 1]) ||
                           (key(run[0]) == key(run[run.Count - 1]) && run.Count > 2 && key(run[1]) > key(run[run.Count - 2]));
            if (reverse) run.Reverse();
            string id = key(run[0]) + ":" + key(run[1]) + ":" + key(run[run.Count - 1]) + ":" + run.Count;
            List<double[]> piece;
            if (!cache.TryGetValue(id, out piece))
            {
                var keep = new bool[run.Count];
                keep[0] = keep[run.Count - 1] = true;
                Dp(run, 0, run.Count - 1, tol, keep);
                var simple = new List<double[]>();
                for (int i = 0; i < run.Count; i++) if (keep[i]) simple.Add(run[i]);
                piece = SmoothOpen(simple);
                cache[id] = piece;
            }
            var oriented = new List<double[]>(piece);
            if (reverse) oriented.Reverse();
            for (int i = 0; i < oriented.Count - 1; i++) result.Add(oriented[i]); // the end is the next piece's start
        }
        return result;
    }

    // Chaikin corner cutting for an open line: both ends stay exactly where they are.
    static List<double[]> SmoothOpen(List<double[]> p)
    {
        if (p.Count < 3) return p;
        var res = new List<double[]> { p[0] };
        for (int i = 0; i < p.Count - 1; i++)
        {
            var a = p[i]; var b = p[i + 1];
            if (i > 0) res.Add(new[] { 0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1] });
            if (i < p.Count - 2) res.Add(new[] { 0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1] });
        }
        res.Add(p[p.Count - 1]);
        return res;
    }

    // Boundary of region k as closed rings on the pixel-corner grid. Each boundary side is an edge running
    // clockwise around the inside pixels; edges are chained, turning right first where two meet in a corner.
    static List<List<double[]>> Trace(int k)
    {
        var from = new List<long>(); var to = new List<long>();
        var outEdges = new Dictionary<long, List<int>>();
        long V = W + 1;
        Func<int, int, bool> inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && region[y * W + x] == k;
        Action<int, int, int, int> add = (x0, y0, x1, y1) =>
        {
            long a = y0 * V + x0, b = y1 * V + x1; int e = from.Count; from.Add(a); to.Add(b);
            List<int> l; if (!outEdges.TryGetValue(a, out l)) { l = new List<int>(2); outEdges[a] = l; } l.Add(e);
        };
        for (int y = 0; y < H; y++) for (int x = 0; x < W; x++)
        {
            if (region[y * W + x] != k) continue;
            if (!inside(x, y - 1)) add(x, y, x + 1, y);
            if (!inside(x + 1, y)) add(x + 1, y, x + 1, y + 1);
            if (!inside(x, y + 1)) add(x + 1, y + 1, x, y + 1);
            if (!inside(x - 1, y)) add(x, y + 1, x, y);
        }
        var used = new bool[from.Count];
        var rings = new List<List<double[]>>();
        for (int s = 0; s < from.Count; s++)
        {
            if (used[s]) continue;
            var ring = new List<double[]>();
            int e = s;
            while (!used[e])
            {
                used[e] = true;
                long a = from[e], b = to[e];
                ring.Add(new double[] { a % V, a / V });
                int dx = (int)(b % V - a % V), dy = (int)(b / V - a / V);
                List<int> next; int pick = -1, bestTurn = int.MinValue;
                if (!outEdges.TryGetValue(b, out next)) break;
                foreach (int n in next)
                {
                    if (used[n]) continue;
                    int ndx = (int)(to[n] % V - from[n] % V), ndy = (int)(to[n] / V - from[n] / V);
                    int turn = dx * ndy - dy * ndx; // > 0 is a right turn with y pointing down
                    if (turn > bestTurn) { bestTurn = turn; pick = n; }
                }
                if (pick < 0) break;
                e = pick;
            }
            if (ring.Count >= 4) rings.Add(ring);
        }
        return rings;
    }

    static double Area(List<double[]> r)
    {
        double a = 0;
        for (int i = 0, j = r.Count - 1; i < r.Count; j = i++) a += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]);
        return a / 2;
    }

    static List<double[]> Simplify(List<double[]> ring, double tol)
    {
        // Split the closed ring at its first point and the point farthest from it, simplify both halves.
        int far = 0; double fd = -1;
        for (int i = 1; i < ring.Count; i++)
        {
            double d = Math.Pow(ring[i][0] - ring[0][0], 2) + Math.Pow(ring[i][1] - ring[0][1], 2);
            if (d > fd) { fd = d; far = i; }
        }
        var keep = new bool[ring.Count + 1];
        var pts = new List<double[]>(ring); pts.Add(ring[0]);
        keep[0] = keep[far] = keep[ring.Count] = true;
        Dp(pts, 0, far, tol, keep); Dp(pts, far, ring.Count, tol, keep);
        var res = new List<double[]>();
        for (int i = 0; i < ring.Count; i++) if (keep[i]) res.Add(ring[i]);
        return res;
    }

    static void Dp(List<double[]> p, int a, int b, double tol, bool[] keep)
    {
        if (b <= a + 1) return;
        double ax = p[a][0], ay = p[a][1], bx = p[b][0], by = p[b][1];
        double len = Math.Sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
        int idx = -1; double md = -1;
        for (int i = a + 1; i < b; i++)
        {
            double d = len < 1e-9 ? Math.Sqrt(Math.Pow(p[i][0] - ax, 2) + Math.Pow(p[i][1] - ay, 2))
                                  : Math.Abs((bx - ax) * (ay - p[i][1]) - (ax - p[i][0]) * (by - ay)) / len;
            if (d > md) { md = d; idx = i; }
        }
        if (md > tol) { keep[idx] = true; Dp(p, a, idx, tol, keep); Dp(p, idx, b, tol, keep); }
    }

    // One round of Chaikin corner cutting, to take the stair-step edge off the pixel outline.
    static List<double[]> Smooth(List<double[]> r)
    {
        if (r.Count < 4) return r;
        var res = new List<double[]>(r.Count * 2);
        for (int i = 0; i < r.Count; i++)
        {
            var a = r[i]; var b = r[(i + 1) % r.Count];
            res.Add(new[] { 0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1] });
            res.Add(new[] { 0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1] });
        }
        return res;
    }

    // Transparent overlay: each region filled with its border colour at fillAlpha, with a solid outline.
    // Cropped to the land; returns the crop in full-resolution region-map pixels "x0,y0,x1,y1".
    public static string SaveOverlay(string path, int fillAlpha, int pad)
    {
        int x0 = W, y0 = H, x1 = 0, y1 = 0;
        for (int y = 0; y < H; y++) for (int x = 0; x < W; x++)
            if (region[y * W + x] >= 0) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
        x0 = Math.Max(0, x0 - pad); y0 = Math.Max(0, y0 - pad); x1 = Math.Min(W - 1, x1 + pad); y1 = Math.Min(H - 1, y1 + pad);
        int ow = x1 - x0 + 1, oh = y1 - y0 + 1;
        using (var b = new Bitmap(ow, oh, PixelFormat.Format32bppArgb))
        {
            var d = b.LockBits(new Rectangle(0, 0, ow, oh), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            var o = new byte[d.Stride * oh];
            for (int y = 0; y < oh; y++) for (int x = 0; x < ow; x++)
            {
                int i = (y + y0) * W + (x + x0), k = region[i]; if (k < 0) continue;
                bool edge = false;
                for (int dy = -1; dy <= 1 && !edge; dy++) for (int dx = -1; dx <= 1 && !edge; dx++)
                {
                    int nx = x + x0 + dx, ny = y + y0 + dy;
                    if (nx < 0 || ny < 0 || nx >= W || ny >= H || region[ny * W + nx] != k) edge = true;
                }
                int j = y * d.Stride + x * 4;
                o[j] = (byte)Border[k][2]; o[j + 1] = (byte)Border[k][1]; o[j + 2] = (byte)Border[k][0];
                o[j + 3] = (byte)(edge ? 230 : fillAlpha);
            }
            Marshal.Copy(o, 0, d.Scan0, o.Length); b.UnlockBits(d); b.Save(path, ImageFormat.Png);
        }
        double f = 18072.0 / W;
        return string.Format("{0},{1},{2},{3}", (int)Math.Round(x0 * f), (int)Math.Round(y0 * f), (int)Math.Round((x1 + 1) * f), (int)Math.Round((y1 + 1) * f));
    }

    // Preview: region colour blended over the map; unassigned land shown in hot pink so gaps stand out.
    public static void SavePreview(string path, int outW)
    {
        int outH = H * outW / W;
        using (var b = new Bitmap(outW, outH, PixelFormat.Format32bppArgb))
        {
            var d = b.LockBits(new Rectangle(0, 0, outW, outH), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            var o = new byte[d.Stride * outH];
            for (int y = 0; y < outH; y++) for (int x = 0; x < outW; x++)
            {
                int i = (y * H / outH) * W + (x * W / outW), j = (y * outW + x) * 4;
                int r = px[i * 4 + 2], g = px[i * 4 + 1], bl = px[i * 4];
                int k = region[i];
                if (k >= 0) { r = (r + Border[k][0] * 2) / 3; g = (g + Border[k][1] * 2) / 3; bl = (bl + Border[k][2] * 2) / 3; }
                else if (cls[i] != -2) { r = 255; g = 0; bl = 160; }
                o[j] = (byte)bl; o[j + 1] = (byte)g; o[j + 2] = (byte)r; o[j + 3] = 255;
            }
            Marshal.Copy(o, 0, d.Scan0, o.Length); b.UnlockBits(d); b.Save(path);
        }
    }
}
