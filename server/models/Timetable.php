<?php
declare(strict_types=1);

class Timetable {
    private int $timetableId;
    private int $generationId;
    private int $subjectId;
    private int $teacherId;
    private int $classroomId;
    private int $timeSlotId;
    private int $sectionId;

    public function __construct(
        int $timetableId,
        int $generationId,
        int $subjectId,
        int $teacherId,
        int $classroomId,
        int $timeSlotId,
        int $sectionId
    ) {
        $this->timetableId = $timetableId;
        $this->generationId = $generationId;
        $this->subjectId = $subjectId;
        $this->teacherId = $teacherId;
        $this->classroomId = $classroomId;
        $this->timeSlotId = $timeSlotId;
        $this->sectionId = $sectionId;
    }

    public function toArray(): array {
        return [
            'timetable_id' => $this->timetableId,
            'generation_id' => $this->generationId,
            'subject_id' => $this->subjectId,
            'teacher_id' => $this->teacherId,
            'classroom_id' => $this->classroomId,
            'time_slot_id' => $this->timeSlotId,
            'section_id' => $this->sectionId
        ];
    }
}