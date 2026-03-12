<?php

namespace App\Http\Resources;

use App\Enums\TaskStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"          => $this->id,
            "title"       => $this->title,
            "description" => $this->description,
            "status"      => $this->status->value,
            "priority"    => $this->priority->value,
            "due_date"    => $this->due_date?->toDateString(),
            "is_overdue"  => $this->due_date?->isPast() && $this->status !== TaskStatus::DONE,
            "created_at"  => $this->created_at->toISOString(),
            ];
    }
}
