<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Car;
use App\Models\Mongo\Spot;
use Carbon\Carbon;

class DistanceController extends Controller
{
    /**
     * Get options for the Distance page
     * @return array
     */
    public function options() {
        $data = [
            'cars' => Car::options(),
            'dates' => Spot::dateOptions(),
        ];

        return compact('data');
    }

    /**
     * Calculate distance travelled
     * @return array
     */
    public function calculate() {
        // Assuming DB timezone is same as client timezone
        $dateStartStr = request('dates')['start'] . " 00:00:00";
        $dateEndStr = request('dates')['end'] . " 23:59:59";
        $dateStart = Carbon::createFromFormat("Y-m-d H:i:s", $dateStartStr);
        $dateEnd = Carbon::createFromFormat("Y-m-d H:i:s", $dateEndStr);

        if($dateEnd->diffInDays($dateStart) > 30) {
            return response("Please select a smaller period " .
                "(30 days max)", 400);
        }

        $data = [];
        foreach (request('cars') as $carId) {
            /** @var Car $car */
            $car = Car::query()->find($carId);

            if(!$car) continue;

            $data[] = [
                'car' => $car->only(['manufacturer', 'model', 'plate_nr']),
                'distance' => $car->distanceTravelled($dateStart, $dateEnd),
            ];
        }

        return compact('data');
    }
}
