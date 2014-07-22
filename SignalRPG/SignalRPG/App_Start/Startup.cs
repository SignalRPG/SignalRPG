using Microsoft.Owin;
using Owin;
using MyWebApplication;

namespace MyWebApplication
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}