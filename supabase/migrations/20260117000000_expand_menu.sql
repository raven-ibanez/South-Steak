-- New Migration: Menu Expansion
-- This migration adds 13 new categories and over 50 new menu items.

-- 1. Create New Categories
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('usda-butter-aged', 'USDA Butter Aged Steak', 'steak', 5, true),
  ('australian-marbled', 'Australian Marbled Steaks', 'steak', 6, true),
  ('wagyu-cubes', 'Wagyu Cubes', 'steak', 7, true),
  ('seafoods', 'Seafoods', 'fish', 8, true),
  ('salmon', 'Salmon', 'fish', 9, true),
  ('tuna', 'Tuna', 'fish', 10, true),
  ('frozen-processed', 'Frozen Processed Meat', 'meat', 11, true),
  ('tonios-sisig', 'Tonio’s Sisig Products', 'meat', 12, true),
  ('premium-spirits', 'Premium Spirits', 'wine', 13, true),
  ('frozen-veggies', 'Frozen Veggies', 'leaf', 14, true),
  ('premium-spices', 'Premium Herb & Spices', 'leaf', 15, true),
  ('love-coffee', 'Love Coffee', 'coffee', 16, true),
  ('sweets', 'Sweets', 'cookie', 17, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- 2. Insert Menu Items

-- USDA BUTTER AGED STEAK
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Porterhouse (4x)', 'Premium USDA Butter Aged Porterhouse', 1290, 'usda-butter-aged', true),
  ('T-Bone (4x)', 'Premium USDA Butter Aged T-Bone', 1290, 'usda-butter-aged', true),
  ('Ribeye (2x)', 'Premium USDA Butter Aged Ribeye', 1650, 'usda-butter-aged', true),
  ('Ribeye (4x)', 'Premium USDA Butter Aged Ribeye', 1650, 'usda-butter-aged', true),
  ('Ribeye (5x)', 'Premium USDA Butter Aged Ribeye', 1650, 'usda-butter-aged', true);

-- AUSTRALIAN MARBLED STEAKS
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Ribeye (2x)', 'Australian Marbled Ribeye', 1590, 'australian-marbled', true),
  ('Ribeye (4x)', 'Australian Marbled Ribeye', 1590, 'australian-marbled', true),
  ('Striploin (4x)', 'Australian Marbled Striploin', 1450, 'australian-marbled', true),
  ('Flat-Iron (4x)', 'Australian Marbled Flat-Iron Steak', 1200, 'australian-marbled', true);

-- WAGYU CUBES
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('2kg/pack Wagyu Cubes', 'Kuchidoke Wagyu Cubes - 2kg pack', 2550, 'wagyu-cubes', true),
  ('1kg/pack Wagyu Cubes', 'Kuchidoke Wagyu Cubes - 1kg pack', 1290, 'wagyu-cubes', true);

-- SEAFOODS
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Vannamei Shrimp (26-30) 500g', 'Premium Vannamei Shrimp', 450, 'seafoods', true),
  ('Vannamei Shrimp (100-200) 500g', 'Premium Vannamei Shrimp', 375, 'seafoods', true),
  ('Squid Rings 1-3cm 500g', 'Tender Squid Rings', 210, 'seafoods', true),
  ('Pompano 400-500g', 'Fresh Pompano (price per piece)', 290, 'seafoods', true),
  ('Nobashi', 'Nobashi Shrimp (price per tray)', 450, 'seafoods', true);

-- SALMON
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Norway Salmon Slab Fillet', 'Premium Norway Salmon Slab (price per kg)', 2100, 'salmon', true);

-- TUNA
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Tuna Panga', 'Tuna Panga (300g to 1000g per pc) - price per kg', 380, 'tuna', true),
  ('Premium Tuna Belly', 'Premium Tuna Belly (300g to 1000g per pc) - price per kg', 650, 'tuna', true);

-- FROZEN PROCESSED MEAT
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Salami Cheese (200g)', 'Premium Salami with Cheese', 65, 'frozen-processed', true),
  ('Chicken Baloney (200g)', 'Tender Chicken Baloney', 70, 'frozen-processed', true),
  ('Chicken Balls (200g)', 'Savory Chicken Balls', 70, 'frozen-processed', true),
  ('Salami Cheese (1kg)', 'Bulk Salami with Cheese', 300, 'frozen-processed', true),
  ('French Fries', 'Premium French Fries (price per kg)', 180, 'frozen-processed', true),
  ('Jamon De Bola', 'Classic Jamon De Bola (price per kg)', 200, 'frozen-processed', true),
  ('Lucban Longganisa', 'Traditional Lucban Longganisa (price per dozen)', 130, 'frozen-processed', true);

-- TONIO’S SISIG PRODUCTS
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Pork Sisig 250g', 'Tonio’s Pork Sisig', 130, 'tonios-sisig', true),
  ('Pork Kilawin 250g', 'Tonio’s Pork Kilawin', 130, 'tonios-sisig', true),
  ('Pork Bagnet 250g', 'Tonio’s Pork Bagnet', 150, 'tonios-sisig', true),
  ('Chicken Sisig 220g', 'Tonio’s Chicken Sisig', 135, 'tonios-sisig', true),
  ('Beef Sisig 220g', 'Tonio’s Beef Sisig', 150, 'tonios-sisig', true),
  ('Bangus Sisig 220g', 'Tonio’s Bangus Sisig', 135, 'tonios-sisig', true);

-- PREMIUM SPIRITS
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Singleton 12 700ml', 'Premium Single Malt Whisky', 1700, 'premium-spirits', true),
  ('Singleton 15 700ml', 'Premium Single Malt Whisky', 2900, 'premium-spirits', true),
  ('Singleton 18 700ml', 'Premium Single Malt Whisky', 5300, 'premium-spirits', true),
  ('Louis XIII', 'Ultra Premium Cognac - *PRE-ORDER ONLY*', 200000, 'premium-spirits', true),
  ('Hennesy Paradis 700ml', 'Exclusive Cognac - *PRE-ORDER ONLY*', 90000, 'premium-spirits', true),
  ('Hennessy XO 700ml', 'Premium Cognac', 11000, 'premium-spirits', true),
  ('Hennessy VSOP 700ml', 'Premium Cognac', 4000, 'premium-spirits', true),
  ('Macallan 12 Double Cask 700ml', 'Single Malt Scotch Whisky', 5000, 'premium-spirits', true),
  ('Macallan 12 Triple Cask 700ml', 'Single Malt Scotch Whisky', 6800, 'premium-spirits', true),
  ('Macallan 12 Sherry Oak 700ml', 'Single Malt Scotch Whisky', 6000, 'premium-spirits', true),
  ('Macallan 18 Sherry Oak 700ml', 'Single Malt Scotch Whisky - *PRE-ORDER ONLY*', 30000, 'premium-spirits', true),
  ('Macallan Night On Earth', 'Limited Edition Single Malt', 11000, 'premium-spirits', true),
  ('Macallan Harmony 700ml', 'Single Malt Scotch Whisky', 14000, 'premium-spirits', true),
  ('Macllan Estate 700ml', 'Exclusive Single Malt - *PRE-ORDER ONLY*', 23000, 'premium-spirits', true),
  ('Macallan 25 700ml', 'Ultra Premium Single Malt - *PRE-ORDER ONLY*', 200000, 'premium-spirits', true),
  ('Blue Label 750ml', 'Johnnie Walker Blue Label', 7000, 'premium-spirits', true),
  ('Double Black 1L', 'Johnnie Walker Double Black', 1650, 'premium-spirits', true),
  ('Black Label 1L', 'Johnnie Walker Black Label', 1400, 'premium-spirits', true),
  ('Jack Daniel’s 1L', 'Tennessee Whiskey', 1500, 'premium-spirits', true),
  ('Jose Cuervo 1 liter', 'Gold Tequila', 1100, 'premium-spirits', true);

-- FROZEN VEGGIES
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Mix Veggies 500g', 'Frozen Mixed Vegetables', 95, 'frozen-veggies', true),
  ('Peeled Garlic 250g', 'Freshly Peeled Garlic', 65, 'frozen-veggies', true),
  ('Whole Garlic 500g', 'Premium Whole Garlic', 110, 'frozen-veggies', true),
  ('Potato 500g', 'Frozen Potato Chunks', 87, 'frozen-veggies', true);

-- PREMIUM HERB & SPICE SELECTION
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Rosemary', 'Premium Dried Rosemary', 110, 'premium-spices', true),
  ('Himalayan Salt 140g (Granules)', 'Mineral-Rich Pink Himalayan Salt', 100, 'premium-spices', true),
  ('Himalayan Salt 140g (Fine)', 'Mineral-Rich Pink Himalayan Salt', 115, 'premium-spices', true),
  ('Thyme 25g', 'Premium Dried Thyme', 90, 'premium-spices', true),
  ('Thyme Powder 50g', 'Premium Thyme Powder', 100, 'premium-spices', true),
  ('Paprika Powder 50g', 'Premium Smoked Paprika', 100, 'premium-spices', true),
  ('Garlic Powder 60g', 'Premium Garlic Powder', 90, 'premium-spices', true),
  ('Chili Flakes 50g', 'Premium Red Chili Flakes', 90, 'premium-spices', true);

-- LOVE COFFEE
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Love Coffee Box (10pcs)', 'Premium Coffee Drip Box', 1000, 'love-coffee', true),
  ('Love Coffee Per Piece', 'Premium Coffee Drip Bag', 120, 'love-coffee', true),
  ('Ready to Drink Love Coffee', 'Freshly Brewed (price per cup)', 130, 'love-coffee', true);

-- SWEETS
INSERT INTO menu_items (name, description, base_price, category, available) VALUES
  ('Lecheflan', 'Classic Filipino Caramel Custard', 150, 'sweets', true);
