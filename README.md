# NAWS - Not Another Web Server

NAWS is not just another web server. Sure, feel free to use it if you find it helpful. However, the primary purpose of NAWS is to create a platform to _demonstrate_ the various patterns of zeromq (as well as derivitive/forked/inspired works like nanomsg) and demonstrate how you can use them in your environment.

## JSDC Talk

To run the JSDC exhibits, first you need to install [vagrant](http://www.vagrantup.com/downloads.html).

Once you have done so, follow these steps:

1. `cd` to the NAWS root directory
2. `vagrant up`
3. Brew a coffee, hug your cat(s), and watch some sappy love movie
4. `vagrant ssh`
5. `sudo -s`
6. `cd talk`
7. `node <exhibit-filename>` and enjoy!