using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Numerics;

namespace SignalRPG.Models.GameClasses
{
    /// <summary>
    /// Every object that gets pushed from the server inherits this class
    /// </summary>
    public class Sprite
    {
        /// <summary>
        /// Random object
        /// </summary>
        protected static Random RandomEngine = new Random();

        protected static int GlobalID { get; set; }
        public int ID { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string Color { get; set; }

        /// <summary>
        /// Offset to draw the object from its current x coord
        /// </summary>
        public int XOffset { get; set; }

        /// <summary>
        /// Offset to draw the object from its current y coord
        /// </summary>
        public int YOffset { get; set; }

        [NonSerialized]
        public Map Map;

        public Sprite()
        {
            var g = Guid.NewGuid();
            
            
            //get the ID for the sprite
            ID = ++GlobalID;

            //player's last position
            var charx = RandomEngine.Next(0, 21);
            var chary = RandomEngine.Next(0, 12);

            X = charx;
            Y = chary;
            Color = string.Format("rgb({0},{1},{2})",
                RandomEngine.Next(0, 256),
                RandomEngine.Next(0, 256),
                RandomEngine.Next(0, 256));
        }
    }
}