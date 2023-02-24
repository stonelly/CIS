using CIS.Common.Constants;
using CIS.Data.Model;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Common.Helper
{
    public class CommonHelper
    {
        public static string GetNoPicture()
        {
            return "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";
        }

        public static List<LocationTypeDTO> GetLocationType()
        {
            List<LocationTypeDTO> result = new List<LocationTypeDTO>();

            foreach (GlobalConst.LocationTypeID val in Enum.GetValues(typeof(GlobalConst.LocationTypeID)))
            {
                LocationTypeDTO lct = new LocationTypeDTO();
                lct.LocationTypeID = (int)val;
                lct.LocationTypeName = Enum.GetName(typeof(GlobalConst.LocationTypeID), val);
                result.Add(lct);
            }

            return result;
        }

        public static string GetClientMachineName(HttpRequest currentRequest)
        {
            string station = "";
            var ClientIPAddr = currentRequest.HttpContext.Connection.RemoteIpAddress;

            //Production
            station = currentRequest.HttpContext.Connection.LocalIpAddress.ToString();
            station = currentRequest.HttpContext.Connection.RemoteIpAddress.ToString();

            //station = currentRequest.ServerVariables["REMOTE_HOST"];
            //station = System.Net.Dns.GetHostEntry(currentRequest.ServerVariables["REMOTE_HOST"]).HostName;
            if (station == "::1")
            {
                station = "192.168.227.90";
            }

            station = station.Replace(".HARTALEGA", "");
            station = station.Replace(".hartalega", "");
            station = station.Replace(".Hartalega", "");
            station = station.Replace(".local", "");
            station = station.Replace(".Local", "");
            station = station.Replace(".LOCAL", "");

            return station;
        }
    }
}
