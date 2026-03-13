<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Enums\TaskStatus;
use App\Enums\TaskPriority;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_tasks_with_filters()
    {
        $project = Project::factory()->create();
        Task::factory()->count(5)->create(['project_id' => $project->id, 'status' => TaskStatus::TODO]);
        Task::factory()->count(3)->create(['project_id' => $project->id, 'status' => TaskStatus::DONE]);

        $response = $this->getJson("/api/projects/{$project->id}/tasks?status=todo");

        $response->assertStatus(200)
                ->assertJsonCount(5, 'data');
    }

    public function test_can_create_task()
    {
        $project = Project::factory()->create();
        $data = [
            'title' => 'Nova Tarefa',
            'description' => 'Descrição',
            'status' => 'todo',
            'priority' => 'high',
            'due_date' => now()->addDays(2)->toDateString(),
        ];

        $response = $this->postJson("/api/projects/{$project->id}/tasks", $data);

        $response->assertStatus(201)
                ->assertJson([
                    'data' => [
                        'title' => 'Nova Tarefa',
                        'status' => 'todo',
                        'priority' => 'high'
                    ]
                ]);

        $this->assertDatabaseHas('tasks', ['title' => 'Nova Tarefa']);
    }

    public function test_can_update_task_status()
    {
        $task = Task::factory()->create(['status' => TaskStatus::TODO]);

        $response = $this->patchJson("/api/tasks/{$task->id}", ['status' => 'in_progress']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'status' => 'in_progress']);
    }

    public function test_can_delete_task()
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('tasks', ['id' => $task->id]);
    }
}