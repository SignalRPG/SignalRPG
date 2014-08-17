using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SignalRPG.Models.Hubs
{
    public class GameHub : BaseHub
    {
        public void MoveCharacter(int x, int y)
        {
            Clients.All.moveCharacter(x, y);
        }
    }
}