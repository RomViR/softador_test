<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordMail;
use App\Models\PasswordReset;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials
     * @return array
     */
    public function login()
    {
        Validator::make(request()->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8',
        ])->validate();

        if (!$token = auth()->attempt(request(['email', 'password']))) {
            return response()->json(['error' => 'Unauthorized'], 422);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Register a user
     * @return array
     */
    public function register()
    {
        Validator::make(request()->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ])->validate();

        User::query()->create([
            'email' => request('email'),
            'password' => bcrypt(request('password')),
        ]);

        return $this->login(request('email'), request('password'));
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout()
    {
        if (auth()->check()) {
            auth()->logout();
        }

        return ['message' => 'Successfully logged out'];
    }

    /**
     * Refresh a token
     * @return array
     */
    public function refresh()
    {
        if(!auth()->check()) {
            return response('expired', 301);
        }

        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure
     * @param  string $token
     * @return array
     */
    protected function respondWithToken($token)
    {
        $user = auth()->check() ? auth()->user() : null;

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'email' => $user->email ?? '',
        ];
    }

    /**
     * Request password reset
     * @return array
     */
    public function forgotPassword()
    {
        Validator::make(request()->all(), [
            'email' => 'required|email|exists:users,email',
        ])->validate();

        $reset = PasswordReset::whereEmail(request('email'))
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->first();

        if(!empty($reset)) {
            return response('Password reset has been already requested. ' .
                'Please check your email.', 400);
        }

        $reset = PasswordReset::query()->create([
            'token' => Str::random(32),
            'email' => request('email'),
        ]);

        Mail::to(request('email'))->queue(new ForgotPasswordMail($reset));

        return ['success' => $reset];
    }

    /**
     * Set new password
     * @return array
     */
    public function setForgotPassword()
    {
        $reset = PasswordReset::query()
            ->whereToken(request('token'))
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->firstOrFail();

        $user = User::query()->whereEmail($reset->email)->firstOrFail();

        $user->update(['password' => bcrypt(request('password'))]);

        $reset->delete();

        return $this->respondWithToken(auth()->attempt([
            'email' => $user->email,
            'password' => request('password'),
        ]));
    }
}