
#require 'rvm/capistrano' # Для работы rvm
#require 'bundler/capistrano'
load 'deploy/assets'

set :application, "Zalipaytv"

role :web, "maaaay.com"                          # Your HTTP server, Apache/etc
role :app, "maaaay.com"                          # This may be the same as your `Web` server
set :use_sudo, false
set :deploy_to, "/webapps/Zalipay"
default_run_options[:pty] = true
ssh_options[:user] = "deploy"
ssh_options[:password] = "aksa1990"
ssh_options[:forward_agent] = true
set :deploy_via, :remote_cache
set :repository,  "https://maay@bitbucket.org/maay/Zalipaytv.git"
set :scm, :git
set :scm_verbose, true
set :branch, 'master'

set :stages, %w(production)
set :default_stage, "staging"

namespace :deploy do
   task :start do ; end
   task :stop do ; end
   task :restart, :roles => :app, :except => { :no_release => true } do
     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}" 
  end
    task :bundle do
      run "cd #{deploy_to}/current/ && bundle install"
    end
 end
 
 
 after :deploy, "deploy:bundle"
 after :deploy, "deploy:restart"