<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;


Route::middleware(["throttle:api"])->group(function () {
    Route::apiResource('projects', ProjectController::class);
    Route::get("projects/{project}/tasks", [TaskController::class, "index"]);
    Route::post("projects/{project}/tasks", [TaskController::class, "store"]);
    Route::patch("tasks/{task}", [TaskController::class, "update"]);
    Route::delete("tasks/{task}", [TaskController::class, "destroy"]);
    Route::get('tasks/{task}', [TaskController::class, 'show']);
});
