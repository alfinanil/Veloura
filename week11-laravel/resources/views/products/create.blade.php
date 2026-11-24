@extends('layouts.app')

@section('title', 'Tambah Produk')

@section('content')
    <div class="page-head">
        <h1>Tambah Produk</h1>
    </div>

    <form action="{{ route('products.store') }}" method="POST" class="card form-card">
        @include('products._form')
    </form>
@endsection
