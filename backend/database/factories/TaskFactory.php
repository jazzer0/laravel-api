<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\Project;
use App\Enums\TaskStatus;
use App\Enums\TaskPriority;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Task::class;
    public function definition(): array
    {
        return [
            'project_id'  => Project::factory(),
            'title'       => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'status'      => $this->faker->randomElement(TaskStatus::cases()),
            'priority'    => $this->faker->randomElement(TaskPriority::cases()),
            'due_date'    => $this->faker->optional()->dateTimeBetween('-1 month', '+1 month'),
        ];
    }
}
