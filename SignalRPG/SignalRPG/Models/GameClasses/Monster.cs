using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using SignalRPG.Models.Hubs;
using System.Threading;


namespace SignalRPG.Models.GameClasses
{
    public class Monster : Sprite
    {

        public Monster()
        {
            MoveMonster();
        }


        #region Async
        
        private void MoveMonster()
        {
            //run an async method to move monster
            Task.Run(() =>
            {
                while (true)
                {
                    //player's last position
                    var charx = RandomEngine.Next(0, 21);
                    var chary = RandomEngine.Next(0, 12);

                    X = charx;
                    Y = chary;

                    GlobalHost.ConnectionManager.GetHubContext<GameHub>().Clients.All.moveObject(ID, X, Y);

                    Thread.Sleep(10000);
                }
            });


        }

        #endregion


    }
}