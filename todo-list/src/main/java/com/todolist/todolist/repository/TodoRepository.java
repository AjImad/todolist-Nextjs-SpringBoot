package com.todolist.todolist.repository;

import com.todolist.todolist.domain.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<TodoList, Long> {

    // SELECT * FROM todolist WHERE (task name) = ?
    Optional<TodoList> findTodoListByTaskName(String taskName);
}
