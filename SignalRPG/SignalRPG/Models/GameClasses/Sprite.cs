using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalRPG.Models.GameClasses
{
    /// <summary>
    /// Every object that gets pushed from the server inherits this class
    /// </summary>
    public class Sprite
    {
        public long ID { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}