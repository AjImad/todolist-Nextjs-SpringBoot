package com.todolist.todolist.service;

import com.todolist.todolist.domain.TodoList;
import com.todolist.todolist.repository.TodoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TodoList> display(){
        return todoRepository.findAll();
    }


    public TodoList addTask(TodoList todoList) {
        Optional<TodoList> todoTask = todoRepository.findTodoListByTaskName(todoList.getTaskName());
        if(todoTask.isPresent()){
            throw new IllegalStateException("This task already exist!");
        }
        return todoRepository.save(todoList);
    }

    public void deleteTask(Long taskId) {
        boolean taskExist = todoRepository.existsById(taskId);
        if(!taskExist){
            throw new IllegalStateException("Task with id " + taskId + " does not exist!");
        }
        todoRepository.deleteById(taskId);
    }

    @Transactional
    public void updateTask(Long taskId, String taskTitle, Boolean isCompleted) {
        TodoList task = todoRepository.findById(taskId).orElseThrow(() -> new IllegalStateException("Can not find this task with id " + taskId));
        if(!taskTitle.isEmpty() && !Objects.equals(taskTitle, task.getTaskName())){
            Optional<TodoList> exist = todoRepository.findTodoListByTaskName(taskTitle);
            if(exist.isPresent()){
                throw new IllegalStateException("This task already taken!");
            }
            task.setTaskName(taskTitle);
        }
        System.out.println("isComp: " + isCompleted);
        if(isCompleted != null && isCompleted != task.getIsCompleted()){
            task.setIsCompleted(isCompleted);
        }
    }
}
