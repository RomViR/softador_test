@push('before-css')
    <link rel="stylesheet" href="{{ recachedAsset('css/angular.min.css') }}" />
@endpush

@push('js')
    <script src="{{ recachedAsset('js/angular.js') }}"></script>
@endpush