using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalRPG.Models.GameClasses
{
    public class Map
    {
        /// <summary>
        /// List of objects on the map
        /// </summary>
        public Dictionary<int, Sprite> Objects { get; private set; }

        public Map(string mapName)
        {
            //create objects list
            Objects = new Dictionary<int, Sprite>();

            //initialize map objects based on the map name
            InitializeMap(mapName);
        }

        #region Initialization

        /// <summary>
        /// Places the interactable objects on the map
        /// </summary>
        /// <param name="mapName"></param>
        private void InitializeMap(string mapName)
        {
            //create a monster
            var monster = new Monster();

            //put the monster on the map
            Objects.Add(monster.ID, monster);
        }

        #endregion
    }
}