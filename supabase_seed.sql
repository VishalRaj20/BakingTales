-- Clear existing data to avoid duplicates
truncate table public.cart cascade;
truncate table public.wishlist cascade;
truncate table public.product_sizes cascade;
truncate table public.products cascade;

-- Project URL: https://jhhomokczuigpyukhuip.supabase.co

-- 1. CAKES (Bucket: cake-images)
INSERT INTO public.products (name, slug, description, category, is_available, images, tags) VALUES
('Chocolate Truffle', 'chocolate-truffle', 'Decadent chocolate truffle cake.', 'cakes', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cake-images/1.jpg'], array['birthday']),
('Red Velvet Heart', 'red-velvet-heart', 'Heart-shaped red velvet delight.', 'cakes', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cake-images/2.jpg'], array['anniversary']),
('Fruit Overload', 'fruit-overload', 'Fresh seasonal fruits on vanilla sponge.', 'cakes', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cake-images/3.webp'], array['birthday']),
('Black Forest', 'black-forest', 'Classic black forest with cherries.', 'cakes', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cake-images/4.jpg'], array['birthday']),
('Pineapple Cream', 'pineapple-cream', 'Soft and juicy pineapple cake.', 'cakes', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cake-images/5.jpg'], array['birthday']);

-- 2. COOKIES (Bucket: cookie-images)
INSERT INTO public.products (name, slug, description, category, is_available, images, tags) VALUES
('Choco Chip Cookies', 'choco-chip-cookies', 'Crunchy cookies loaded with chocolate chips.', 'cookies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cookie-images/1.jpg'], array['snack']),
('Oatmeal Raisin', 'oatmeal-raisin', 'Healthy and delicious oatmeal cookies.', 'cookies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cookie-images/2.jpg'], array['healthy']),
('Butter Cookies', 'butter-cookies', 'Melt in your mouth butter cookies.', 'cookies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cookie-images/3.jpg'], array['snack']),
('Macarons', 'macarons', 'Assorted french macarons.', 'cookies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cookie-images/4.jpg'], array['gift']),
('Gingerbread', 'gingerbread', 'Spiced gingerbread men.', 'cookies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/cookie-images/5.jpg'], array['festive']);

-- 3. PASTRIES (Bucket: pastry-images)
INSERT INTO public.products (name, slug, description, category, is_available, images, tags) VALUES
('Dark Chocolate Pastry', 'dark-chocolate-pastry', 'Slice of heaven.', 'pastries', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/pastry-images/1.jpg'], array['snack']),
('Fruit Pastry', 'fruit-pastry', 'Fresh fruit topping.', 'pastries', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/pastry-images/2.jpg'], array['snack']),
('Red Velvet Pastry', 'red-velvet-pastry', 'Mini version of our classic cake.', 'pastries', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/pastry-images/3.jpg'], array['snack']),
('Pineapple Pastry', 'pineapple-pastry', 'Classic pineapple slice.', 'pastries', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/pastry-images/4.jpg'], array['snack']),
('Tiramisu Slice', 'tiramisu-slice', 'Coffee flavored italian dessert.', 'pastries', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/pastry-images/5.jpg'], array['dessert']);

-- 4. BROWNIES (Bucket: Bronie-images)
INSERT INTO public.products (name, slug, description, category, is_available, images, tags) VALUES
('Walnut Brownie', 'walnut-brownie', 'Fudgy brownie with roasted walnuts.', 'brownies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/Bronie-images/1.jpg'], array['snack']),
('Fudge Brownie', 'fudge-brownie', 'Gooey double chocolate fudge brownie.', 'brownies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/Bronie-images/2.jpg'], array['snack']),
('Hazelnut Brownie', 'hazelnut-brownie', 'Rich brownie with hazelnut spread.', 'brownies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/Bronie-images/3.webp'], array['snack']),
('Cheesecake Brownie', 'cheesecake-brownie', 'Swirl of cheesecake in brownies.', 'brownies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/Bronie-images/4.jpg'], array['dessert']),
('Blondie', 'blondie', 'White chocolate brownie.', 'brownies', true, array['https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/Bronie-images/5.jpg'], array['snack']);


-- Insert SIZES for all products
INSERT INTO public.product_sizes (product_id, size_label, price)
SELECT id, '500g', 550 FROM public.products WHERE category = 'cakes';

INSERT INTO public.product_sizes (product_id, size_label, price)
SELECT id, '1kg', 1000 FROM public.products WHERE category = 'cakes';

INSERT INTO public.product_sizes (product_id, size_label, price)
SELECT id, '1 pc', 80 FROM public.products WHERE category = 'pastries';

INSERT INTO public.product_sizes (product_id, size_label, price)
SELECT id, 'Pack of 6', 250 FROM public.products WHERE category = 'cookies';

INSERT INTO public.product_sizes (product_id, size_label, price)
SELECT id, '1 pc', 120 FROM public.products WHERE category = 'brownies';
