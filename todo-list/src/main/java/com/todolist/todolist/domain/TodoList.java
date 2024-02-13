package com.todolist.todolist.domain;

import jakarta.persistence.*;

@Entity(name = "todolist")
@Table(name = "todolist", uniqueConstraints = {
        @UniqueConstraint(name = "unique_task", columnNames = "task_name")
})
public class TodoList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_name", nullable = false, columnDefinition = "TEXT")
    private String taskName;

    @Column(name = "is_completed", nullable = true)
    private Boolean isCompleted;

    public TodoList() {

    }

    public TodoList(String taskName, boolean isCompleted) {
        this.taskName = taskName;
        this.isCompleted = isCompleted;
    }

    public TodoList(Long id, String taskName, boolean isCompleted) {
        this.id = id;
        this.taskName = taskName;
        this.isCompleted = isCompleted;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(boolean completed) {
        isCompleted = completed;
    }

    @Override
    public String toString() {
        return "TodoList{" +
                "id=" + id +
                ", taskName='" + taskName + '\'' +
                ", isCompleted=" + isCompleted +
                '}';
    }
}
