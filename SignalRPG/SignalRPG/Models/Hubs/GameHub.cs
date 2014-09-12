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
        /// Collection of objects
        /// </summary>
        public static Dictionary<string, Sprite> Players { get; private set; }


        /// <summary>
        /// Collection of objects
        /// </summary>
        public static Dictionary<string, Map> Maps { get; private set; }

        static GameHub()
        {
            Maps = new Dictionary<string, Map>();
            Players = new Dictionary<string, Sprite>();
        }


        public override System.Threading.Tasks.Task OnConnected()
        {

            //player has connected. We need to retrieve some information about the player

            //we will identify the player by the Identity.
            //Context.User.Identity.Name

            //we'll get the user ID and assign it
            //for now though we just increment id

            

            //create the player object to be placed on the map
            var obj = new Character();


            //we need to figure out what map the player is on. Get it from DB.
            var mapName = "map-test";

            //create the map instance if it does not exist. This will also create
            //a signalR group of the same name
            CreateMapInstance(mapName);

            //now that we have the map instance (or ensured it was created) we look up the map
            //and get the map object to push our object on
            if (Maps.ContainsKey(mapName))
            {
                //get the map
                var map = Maps[mapName];

                //add our connection id to the map if it doesn't exist yet. this id will be tied to our object
                if (!Players.ContainsKey(Context.ConnectionId))
                {

                    //add the player object to the list of all players
                    Players.Add(Context.ConnectionId, obj);

                    //add layer to map object list
                    map.Objects.Add(obj.ID, obj);

                    obj.Map = map;

                    //now we have to notify all other clients on the map that a new player joined
                    Clients.OthersInGroup(mapName).characterEnter(obj);

                    //for the connecting client only, get all objects currently in the list for the map
                    foreach (var mapObj in map.Objects)
                    {
                        Clients.Client(Context.ConnectionId).characterEnter(mapObj.Value);
                    }

                    //register your character's ID so the client knows which object is the
                    //player
                    Clients.Client(Context.ConnectionId).registerCharacter(obj.ID);
                }

            }

            return base.OnConnected();
        }

        public override System.Threading.Tasks.Task OnDisconnected()
        {
            //get the map of the player
            var mapName = "map-test";

            //find the map
            if (Maps.ContainsKey(mapName))
            {
                //get the map based on the name
                var map = Maps[mapName];

                //get the player
                if (Players.ContainsKey(Context.ConnectionId))
                {
                    //get the object
                    var obj = Players[Context.ConnectionId];

                    //when the player connects, add them to the object list
                    Players.Remove(Context.ConnectionId);

                    //remove player from map
                    obj.Map.Objects.Remove(obj.ID);

                    //character left, update all other clients
                    Clients.OthersInGroup(mapName).characterLeave(obj.ID);
                }

            }


            return base.OnDisconnected();
        }

        public override System.Threading.Tasks.Task OnReconnected()
        {
            return base.OnReconnected();
        }

        #region Methods

        /// <summary>
        /// checks to see if an instance of a map exists already, if not, creates it
        /// </summary>
        /// <param name="map"></param>
        private void CreateMapInstance(string mapName)
        {
            //check to see if this instance is created already
            if (!Maps.ContainsKey(mapName))
            {
                //nope, create a new map instance
                var map = new Map(mapName);

                //add map to dictionary
                Maps.Add(mapName, map);

                //create a signalR group
                Groups.Add(Context.ConnectionId, "map-test");
            }
        }

        public void MoveCharacter(long id, int x, int y)
        {
            //look up the character by the ID and
            if (Players.ContainsKey(Context.ConnectionId)){
                var obj = Players[Context.ConnectionId];

                obj.X = x;
                obj.Y = y;
            }
            

            Clients.All.moveObject(id, x, y);
        }
        #endregion

    }
}