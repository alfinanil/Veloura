@php
    $images = [
        'images/skincare.jpg'  => 'Skincare',
        'images/makeup.jpg'    => 'Makeup',
        'images/haircare.jpg'  => 'Haircare',
        'images/bodycare.jpg'  => 'Bodycare',
    ];
@endphp

@csrf
@if ($product->exists)
    @method('PUT')
@endif

<div class="field">
    <label for="name">Nama Produk</label>
    <input type="text" id="name" name="name" value="{{ old('name', $product->name) }}">
    @error('name') <small class="error">{{ $message }}</small> @enderror
</div>

<div class="grid-2">
    <div class="field">
        <label for="category_id">Kategori</label>
        <select id="category_id" name="category_id">
            <option value="">-- Pilih kategori --</option>
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" @selected(old('category_id', $product->category_id) == $category->id)>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
        @error('category_id') <small class="error">{{ $message }}</small> @enderror
    </div>

    <div class="field">
        <label for="image">Gambar</label>
        <select id="image" name="image">
            <option value="">Tanpa gambar</option>
            @foreach ($images as $path => $label)
                <option value="{{ $path }}" @selected(old('image', $product->image) == $path)>{{ $label }}</option>
            @endforeach
        </select>
        @error('image') <small class="error">{{ $message }}</small> @enderror
    </div>
</div>

<div class="field">
    <label for="subtitle">Subjudul (opsional)</label>
    <input type="text" id="subtitle" name="subtitle" value="{{ old('subtitle', $product->subtitle) }}">
    @error('subtitle') <small class="error">{{ $message }}</small> @enderror
</div>

<div class="field">
    <label for="description">Deskripsi</label>
    <textarea id="description" name="description" rows="4">{{ old('description', $product->description) }}</textarea>
    @error('description') <small class="error">{{ $message }}</small> @enderror
</div>

<div class="grid-3">
    <div class="field">
        <label for="price">Harga (Rp)</label>
        <input type="number" id="price" name="price" min="0" value="{{ old('price', $product->price) }}">
        @error('price') <small class="error">{{ $message }}</small> @enderror
    </div>
    <div class="field">
        <label for="discount">Diskon (%)</label>
        <input type="number" id="discount" name="discount" min="0" max="100" value="{{ old('discount', $product->discount) }}">
        @error('discount') <small class="error">{{ $message }}</small> @enderror
    </div>
    <div class="field">
        <label for="stock">Stok</label>
        <input type="number" id="stock" name="stock" min="0" value="{{ old('stock', $product->stock) }}">
        @error('stock') <small class="error">{{ $message }}</small> @enderror
    </div>
</div>

<div class="form-actions">
    <button type="submit" class="btn btn-primary">{{ $product->exists ? 'Update' : 'Simpan' }}</button>
    <a href="{{ route('products.index') }}" class="btn btn-ghost">Batal</a>
</div>
