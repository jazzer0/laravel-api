<?php

namespace App\Models;

use App\Enums\TaskStatus;
use App\Enums\TaskPriority;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "project_id",
        "title",
        "description",
        "status",
        "priority",
        "due_date"
    ];

    protected $casts = [
        'status'   => TaskStatus::class,
        'priority' => TaskPriority::class,
        'due_date' => 'date',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where("due_date", "<", now())
            ->whereNot("status", TaskStatus::DONE);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters["status"] ?? null, fn($q, $v) => $q->where("status", $v))
            ->when($filters["priority"] ?? null, fn($q, $v) => $q->where("priority", $v));
    }
}
