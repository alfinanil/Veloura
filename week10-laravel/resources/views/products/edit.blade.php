@extends('layouts.app')

@section('title', 'Edit Produk')

@section('content')
    <div class="page-head">
        <h1>Edit Produk</h1>
    </div>

    <form action="{{ route('products.update', $product) }}" method="POST" class="card form-card">
        @include('products._form')
    </form>
@endsection
