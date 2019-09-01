<?php

namespace App\Models\Mongo;

use Jenssegers\Mongodb\Eloquent\Model;

class Spot extends Model
{
    protected $connection = 'mongodb';

    protected $table = 'spot';

    protected $dates = ['time'];

    /**
     * @return array
     */
    public static function dateOptions() {
        // Only use records that have time of the date type
        return [
            'min' => Spot::query()
                ->where('time', 'type', 'date')
                ->orderBy('time', 'asc')
                ->first()->time,
            'max' => Spot::query()
                ->where('time', 'type', 'date')
                ->orderBy('time', 'desc')
                ->first()->time,
        ];
    }

    /**
     * @param Spot $nextPoint
     * @return float|int
     */
    public function diff(Spot $nextPoint) {
        return Spot::haversineDistance($this->lat, $this->lng,
            $nextPoint->lat, $nextPoint->lng);
    }

    /**
     * Calculate distance between 2 points using haversine formula
     * Coordinates input in decimal degrees, distance output in meters
     * https://en.wikipedia.org/wiki/Haversine_formula
     * @param $latFrom
     * @param $lonFrom
     * @param $latTo
     * @param $lonTo
     * @return float|int
     */
    private static function haversineDistance($latFrom, $lonFrom, $latTo, $lonTo) {
        $radius = 6371000; // Earth radius in meters

        $latFrom = deg2rad($latFrom);
        $lonFrom = deg2rad($lonFrom);
        $latTo = deg2rad($latTo);
        $lonTo = deg2rad($lonTo);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $distance = 2 * $radius * asin(sqrt(pow(sin($latDelta / 2), 2) +
                cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return $distance;
    }
}
