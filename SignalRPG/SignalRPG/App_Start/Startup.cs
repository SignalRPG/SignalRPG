using Microsoft.Owin;
using Owin;


namespace SignalRPG
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}