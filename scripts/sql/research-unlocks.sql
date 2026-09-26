-- Alchemical Research Tree: unlocked nodes (entity LuminiaAPI/Entities/ResearchUnlock.cs).
-- One row per unlocked node; NodeId is the node's id in
-- LuminiaAPI/LuminiaWebsite/src/app/infernal-alchemy/research-tree/research-tree.data.ts.
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS luminia.alchemicalresearchtreeunlocks (
  ObjectId     INT          NOT NULL AUTO_INCREMENT,
  NodeId       VARCHAR(64)  NOT NULL,
  CreationUser VARCHAR(45)  NULL,
  CreationDate DATETIME     NULL,
  UpdateUser   VARCHAR(45)  NULL,
  UpdateDate   DATETIME     NULL,
  PRIMARY KEY (ObjectId),
  UNIQUE KEY UX_alchemicalresearchtreeunlocks_NodeId (NodeId)
);

-- The party's unlocks at the time of the switch to the database
INSERT IGNORE INTO luminia.alchemicalresearchtreeunlocks (NodeId, CreationUser, CreationDate) VALUES
  ('healing',          'LuminiaDb', NOW()),
  ('healing-1',        'LuminiaDb', NOW()),
  ('mana',             'LuminiaDb', NOW()),
  ('mana-1',           'LuminiaDb', NOW()),
  ('smoozies',         'LuminiaDb', NOW()),
  ('bandera',          'LuminiaDb', NOW()),
  ('bandera-radius-1', 'LuminiaDb', NOW()),
  ('bandera-fire-1',   'LuminiaDb', NOW());
