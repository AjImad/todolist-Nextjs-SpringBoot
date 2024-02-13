package com.todolist.todolist.config;

import com.todolist.todolist.domain.TodoList;
import com.todolist.todolist.repository.TodoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class TodoConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true)
                .allowedHeaders("*");
    }

    @Bean
    CommandLineRunner commandLineRunner (TodoRepository todoRepository){
        return args -> {
            TodoList task1 = new TodoList("first task", false);
            TodoList task2 = new TodoList("second task", false);

            todoRepository.saveAll(List.of(task1, task2));
        };
    }
}
