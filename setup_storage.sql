-- 1. Create the 'products' bucket for storing cake images
insert into storage.buckets (id, name, public) 
values ('products', 'products', true);

-- 2. Allow Public View Access (So everyone can see the cakes)
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'products' );

-- 3. Allow Admins to Upload (So you can add photos)
create policy "Admin Upload" 
on storage.objects for insert 
with check ( 
  bucket_id = 'products' 
  and exists (select 1 from profiles where id = auth.uid() and role = 'admin') 
);

-- 4. Allow Admins to Delete (Optional, for cleanup)
create policy "Admin Delete" 
on storage.objects for delete 
using ( 
  bucket_id = 'products' 
  and exists (select 1 from profiles where id = auth.uid() and role = 'admin') 
);
