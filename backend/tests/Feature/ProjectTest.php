<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_projects_with_task_count()
    {
        Project::factory(3)->create();

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => ['id', 'name', 'description', 'status', 'tasks_count', 'created_at', 'updated_at']
                    ]
                ]);
    }

    public function test_can_create_project()
    {
        $data = [
            'name' => 'Novo Projeto',
            'description' => 'Descrição do projeto',
            'status' => 'active'
        ];

        $response = $this->postJson('/api/projects', $data);

        $response->assertStatus(201)->assertJson(['data' => ['name' => 'Novo Projeto','description' => 'Descrição do projeto','status' => 'active']]);

        $this->assertDatabaseHas('projects', $data);
    }

    public function test_cannot_create_project_without_name()
    {
        $response = $this->postJson('/api/projects', []);
        $response->assertStatus(422);
    }
}