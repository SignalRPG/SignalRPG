using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SignalRPG.Models.Hubs
{
    public class GameHub : BaseHub
    {

        public static Dictionary<string, object> ObjectList { get; private set; }

        static GameHub()
        {
            ObjectList = new Dictionary<string, object>();
        }


        public override System.Threading.Tasks.Task OnConnected()
        {
            if (!ObjectList.ContainsKey(Context.ConnectionId))
            {
                //add connection to this group
                Groups.Add(Context.ConnectionId, "map-test");

                var rnd = new  Random();

                var charx = rnd.Next(0, 21);
                var chary = rnd.Next(0, 13);

                var obj = new { x = charx, y = chary, name = Context.User.Identity.Name };
                //when the player connects, add them to the object list
                ObjectList.Add(Context.ConnectionId, obj );

                //push the object to the game map for all other clients in the map
                Clients.OthersInGroup("map-test").characterEnter(obj);
                

                //for the connecting client only, get all objects currently in the list for the map
                foreach (var pair in ObjectList)
                {
                    Clients.Client(Context.ConnectionId).characterEnter(pair.Value);
                }
            }

            return base.OnConnected();
        }

        public override System.Threading.Tasks.Task OnDisconnected()
        {

            if (ObjectList.ContainsKey(Context.ConnectionId))
            {
                //when the player connects, add them to the object list
                ObjectList.Remove(Context.ConnectionId);
            }

            return base.OnDisconnected();
        }

        public override System.Threading.Tasks.Task OnReconnected()
        {
            return base.OnReconnected();
        }

        public void MoveCharacter(int x, int y)
        {
            Clients.All.moveCharacter(x, y);
        }
    }
}