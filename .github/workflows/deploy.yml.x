name: Deploy

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1

    - name: Copy repository contents via scp
      uses: appleboy/scp-action@master
      env:
        HOST: ${{ secrets.SERVER_IP }}
        USERNAME: ${{ secrets.SERVER_USERNAME }}
        PORT: ${{ secrets.PORT }}
        KEY: ${{ secrets.SSHKEY }}
      with:
        source: "."
        target: "/your/website/directory"

    - name: Executing remote command
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        USERNAME: ${{ secrets.USERNAME }}
        PORT: ${{ secrets.PORT }}
        KEY: ${{ secrets.SSHKEY }}
        script: ls