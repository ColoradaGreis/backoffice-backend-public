module.exports = {
  apps: [
    {
      name: 'backoffice-backend',
      script: './app.js',
      error_file: './err.log',
      out_file: './out.log',
      merge_logs: true,
      autorestart: true,
      log_date_format: 'DD-MM-YYYY HH:mm:ss,SSS Z',
      env: {
        NODE_ENV: 'development',
        NODE_PORT: '3500'
      }
    }
  ]
}
