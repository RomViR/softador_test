<!doctype html>
<html ng-app="app" ng-cloak>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Test</title>

    @include('_includes._angular')
    @stack('before-css')
    <link rel="stylesheet" href="{{ recachedAsset('css/app.css') }}" />
    @stack('css')

    <script>
        var SITE_URL = '{{ url('/') }}';
    </script>
</head>
<body>
    <section ui-view="header"></section>
    <section ui-view="content"></section>
    <section ui-view="footer"></section>

    <div id="loading-screen">Loading...</div>

    {{--<script src="{{ recachedAsset('js/app.js') }}"></script>--}}
    @stack('js')
</body>
</html>