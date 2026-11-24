@extends('layouts.app')

@section('title', 'Product Management')

@section('content')
    <div class="page-head">
        <div>
            <h1>Product Management</h1>
            <p class="muted">{{ $products->count() }} produk tersimpan di database.</p>
        </div>
        <a href="{{ route('products.create') }}" class="btn btn-primary">+ Tambah Produk</a>
    </div>

    <div class="card table-wrap">
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Produk</th>
                    <th>Kategori</th>
                    <th>Deskripsi</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th class="center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($products as $product)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>
                            <div class="product-cell">
                                @if ($product->image)
                                    <img src="{{ asset($product->image) }}" alt="" class="thumb">
                                @endif
                                <div>
                                    <strong>{{ $product->name }}</strong>
                                    @if ($product->subtitle)
                                        <div class="muted small">{{ $product->subtitle }}</div>
                                    @endif
                                </div>
                            </div>
                        </td>
                        <td>{{ $product->category->name ?? '-' }}</td>
                        <td class="desc">{{ \Illuminate\Support\Str::limit($product->description, 60) }}</td>
                        <td>
                            Rp {{ number_format($product->final_price, 0, ',', '.') }}
                            @if ($product->discount > 0)
                                <div class="small"><s class="muted">Rp {{ number_format($product->price, 0, ',', '.') }}</s>
                                    <span class="badge">-{{ $product->discount }}%</span></div>
                            @endif
                        </td>
                        <td>{{ $product->stock }}</td>
                        <td class="center actions">
                            <a href="{{ route('products.edit', $product) }}" class="btn btn-sm btn-edit">Edit</a>
                            <form action="{{ route('products.destroy', $product) }}" method="POST"
                                  onsubmit="return confirm('Yakin ingin menghapus produk ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-danger">Hapus</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="center muted">Belum ada produk. Klik "Tambah Produk" untuk menambahkan.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
