<?php

namespace App\Models\Mongo;

use Jenssegers\Mongodb\Eloquent\Model;

class Car extends Model
{
    protected $connection = 'mongodb';

    protected $table = 'car';

    public static function options() {
        return Car::query()->get(['_id', 'manufacturer', 'model', 'plate_nr']);
    }

    /**
     * @param $dateStart
     * @param $dateEnd
     * @return float|int
     */
    public function distanceTravelled($dateStart, $dateEnd) {
        $points = Spot::query()
            ->where(['imei' => $this->tracker['imei']])
            ->whereBetween('time', [$dateStart, $dateEnd])
            ->orderBy('time', 'asc')
            ->get();

        $distance = 0;

        if (count($points) > 1) {
            for ($i = 0; $i < count($points) - 1; $i++) {
                /** @var Spot[] $points */
                $distance += $points[$i]->diff($points[$i + 1]);
            }
        }

        return $distance;
    }
}
