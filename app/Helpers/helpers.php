<?php


/**
 * @param $path
 * @return string
 */

function recachedAsset($path)
{
    $suffix = env('ASSET_CACHE_SUFFIX');
    return asset($path . '?v=' . $suffix);
}