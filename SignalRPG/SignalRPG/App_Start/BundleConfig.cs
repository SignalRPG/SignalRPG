﻿using System.Web;
using System.Web.Optimization;

namespace SignalRPG
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            //scripts
            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/Scripts/jquery-2.1.1.js",
                "~/Scripts/jquery.unobtrusive-ajax.min.js",
                "~/Scripts/jquery.signalR-2.1.0.min.js",
                "~/Scripts/bootstrap.js"));

            //game engine
            bundles.Add(new ScriptBundle("~/bundles/game").Include(
                "~/Scripts/game-classes.js",
                "~/Scripts/game-map.js",
                "~/Scripts/game-engine.js",
                "~/Scripts/game.js"));


            //css
            bundles.Add(new StyleBundle("~/bundles/css").Include(
                "~/Content/bootstrap.min.css",
                "~/Content/site.css"));

            //css
            bundles.Add(new StyleBundle("~/bundles/game-css").Include(
                "~/Content/game.css"));
        }
    }
}
