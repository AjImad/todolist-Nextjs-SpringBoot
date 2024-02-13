package com.todolist.todolist.web;

import com.todolist.todolist.domain.TodoList;
import com.todolist.todolist.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api")
public class TodoController {

    private TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping(path = "/tasks")
    public List<TodoList> displayTasks(){
        return todoService.display();
    }

    @PostMapping
    public TodoList addTask(@RequestBody TodoList todoList) {
        return todoService.addTask(todoList);
    }

    @DeleteMapping(path = "{taskId}")
    public void deleteTask(@PathVariable(name = "taskId") Long taskId){
        todoService.deleteTask(taskId);
    }

    @PutMapping(path = "{taskId}")
    public void updateTask(
            @PathVariable("taskId") Long taskId,
            @RequestParam(required = false) String taskTitle,
            @RequestParam(required = false) Boolean isCompleted)
    {
        todoService.updateTask(taskId,taskTitle, isCompleted);
    }
}
