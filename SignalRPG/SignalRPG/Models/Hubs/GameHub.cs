using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SignalRPG.Models.GameClasses;

namespace SignalRPG.Models.Hubs
{
    public class GameHub : BaseHub
    {
        /// <summary>
        /// Random object
        /// </summary>
        private static Random _random = new Random();

        private static long _globalId = 0;

        /// <summary>
        /// Collection of objects
        /// </summary>
        public static Dictionary<string, Sprite> ObjectList { get; private set; }

        static GameHub()
        {
            ObjectList = new Dictionary<string, Sprite>();
        }


        public override System.Threading.Tasks.Task OnConnected()
        {
            if (!ObjectList.ContainsKey(Context.ConnectionId))
            {
                //add connection to this group
                Groups.Add(Context.ConnectionId, "map-test");



                var charx = _random.Next(0, 21);
                var chary = _random.Next(0, 12);

                //increment id
                _globalId++;

                //create object
                var obj = new Character() { ID = _globalId, X = charx, Y = chary,
                    Color = string.Format("rgb({0},{1},{2})",
                        _random.Next(0, 256),
                        _random.Next(0, 256),
                        _random.Next(0, 256))
                };

                //when the player connects, add them to the object list
                ObjectList.Add(Context.ConnectionId, obj);

                //push the object to the game map for all other clients in the map
                Clients.OthersInGroup("map-test").characterEnter(obj);


                //for the connecting client only, get all objects currently in the list for the map
                foreach (var pair in ObjectList)
                {
                    Clients.Client(Context.ConnectionId).characterEnter(pair.Value);
                }

                //register your character
                Clients.Client(Context.ConnectionId).registerCharacter(_globalId);
            }

            return base.OnConnected();
        }

        public override System.Threading.Tasks.Task OnDisconnected()
        {

            if (ObjectList.ContainsKey(Context.ConnectionId))
            {
                //get the object
                var obj = ObjectList[Context.ConnectionId];

                //when the player connects, add them to the object list
                ObjectList.Remove(Context.ConnectionId);

                //character left, update all other clients
                Clients.OthersInGroup("map-test").characterLeave(obj.ID);
            }

            return base.OnDisconnected();
        }

        public override System.Threading.Tasks.Task OnReconnected()
        {
            return base.OnReconnected();
        }

        public void MoveCharacter(long id, int x, int y)
        {
            Clients.All.moveCharacter(id, x, y);
        }
    }
}