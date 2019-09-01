<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        if(empty(request('token'))) {
            $headerParser = new \Tymon\JWTAuth\Http\Parser\AuthHeaders;
            $headerParser->setHeaderName('Authorization');
            \Tymon\JWTAuth\Facades\JWTAuth::parser()->setChain([$headerParser]);
        }
    }
}
