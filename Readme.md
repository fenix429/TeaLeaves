
# Want some Tea? #

## Why the name TeaLeaves? ##

I don't know, sounded interesting at the time.  Also, I liked the parallel between a fortune teller reading tea leaves and someone parsing through error logs.

TeaLeaves is the first iteration of a system to collect various error and exception reports from applications you may be in-charge of running.  Any app that can make an http request can use this system.  It'll will collect all the details in one spot and let you get at them much more easily than parsing an error log somewhere.

So what does TeaLeaves collect?  Whatever you want.  The default fields are "Description", "Details" (good place for stack traces), "File", "Line Number", and "Extra" for whatever you like.

Also it should be noted that I said this was a first iteration.  This is nowhere near ready for actual use.  Some things need to be done in order for this to be useful in the real world.  Also I make no promises on the stability of the system.

**TODO:**

- Test cases for everything need to be written
- The private API needs locked down, either through a user system, or set only to be accessed from localhost
- Grunt is not building the scss correctly for some reason
- There is still development central code hanging around in the Sinatra Application
- More I'm sure but I can't think of it right now

## License ##

For the moment this is being released under the [GPLv2](http://opensource.org/licenses/GPL-2.0).

I may choose to shift to a more permissive license at a later time.