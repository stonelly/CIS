using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Common.Helper
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string QAISUrl { get; set; }
        public string CPDHMIUrl { get; set; }
        public string D365Url { get; set; }
        public string D365DB { get; set; }
        public string baseURL { get; set; }
        public string ACMSEnvironment { get; set; }
        public string OracleConnection { get; set; }
        public string FloorSystemConnection { get; set; }
        public bool PostWebAdmin { get; set; }
    }
}
