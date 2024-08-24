const fs = require('fs');
const { Command } = require('commander');
const program = new Command();
const file = './todos.json';

program
  .name('CLI-TODO')
  .description('CLI to add/manage tasks')
  .version('0.8.0');

program.command('add')
  .description('Add a new task')
  .argument('<taskName>', 'Task description')
  .argument('<taskTime>', 'Task time')
  .action((taskName, taskTime) => {

   
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
       console.log(`error reading file :`, err)
      }
      const convertToJSON = JSON.parse(data)
      let tasks = [...convertToJSON];

      const newTask = {
        taskId: convertToJSON.length + 1,
        name: taskName,
        time: taskTime,
        status: 'incomplete'
      };

      tasks.push(newTask);

      fs.writeFile(file, JSON.stringify(tasks, undefined, 2), (error) => {
        if (error) {
          console.log('Error adding', error);
        } else {
          console.log('Task added');
        }
      });
    });
  });

  program.command('task-list')
  .description('list todo tasks')
  .action(()=> {
    fs.readFile(file, 'utf8', (err, data)=> {
        if(err) return console.log('error reading file :', err);

        let tasks = JSON.parse(data);

        if(tasks.length > 0){

            console.log('ID', ' | ', 'Task Name', ' | ', 'Task Time', 'Task Status');
            for(i = 0; i < tasks.length; i++){
                console.log(tasks[i].taskId, ' | ', tasks[i].name, ' | ', tasks[i]?.time || '--', ' | ' , tasks[i]?.status || '--');
            }
        }else {
            console.log('Add some tasks before you list them :)');
        }

       
    })
  })

  program.command('clear-list')
  .description('help you delete the task')
  .action(()=> {
    fs.readFile(file, 'utf8', (err, data)=> {
        if(err) return console.log('error reading file :', err);

        let tasks = JSON.parse(data);
 
      if (tasks.length > 0) {
        fs.writeFile(file, JSON.stringify([], undefined, 2), (error) => {
          if (error) {
            console.log('Error clearing task list', error);
          } else {
            console.log('Task list Clear');
          }
        });
      } else {
        console.log("No Task to clear");
      }
        
    }) 
  })

  program.command('delete')
  .description('help you delete the task')
  .argument('<taskId>', 'helps delete the task')
  .action((taskId)=> {
    fs.readFile(file, 'utf8', (err, data)=> {
        if(err) return console.log('error reading file :', err);

        let tasks = JSON.parse(data);

        const updatedTasks = tasks.filter((task) => task.taskId !== Number(taskId));

        
      if (updatedTasks !== tasks && tasks.length > 0) {
        fs.writeFile(file, JSON.stringify(updatedTasks, undefined, 2), (error) => {
          if (error) {
            console.log('Error deleting task', error);
          } else {
            console.log('Task deleted');
          }
        });
      } else {
        console.log("Task not found");
      }
        
    }) 
  })


  program.command('done')
  .description('mark task complete')
  .argument('<taskId>', 'helps compelte the task')
  .action((taskId)=> {
    fs.readFile(file, 'utf8', (err, data)=> {
        if(err) return console.log('error reading file :', err);

        let tasks = JSON.parse(data);
        let taskTracker = false;
  
        const updatedTasks = tasks.map(task => {
          if (task.taskId == Number(taskId)) {
            taskTracker = true;
            return { ...task, status: 'done!' };
          }
          return task;
        });
  
        if (taskTracker) {
          fs.writeFile(file, JSON.stringify(updatedTasks, null, 2), (error) => {
            if (error) {
              console.log('Error updating task status:', error);
            } else {
              console.log('Hooray! you completed the task');
            }
          });
        } else {
          console.log('Task not found');
        }
        
    }) 
  })
program.parse();



