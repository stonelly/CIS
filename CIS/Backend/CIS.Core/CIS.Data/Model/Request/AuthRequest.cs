﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model.Request
{
    public class AuthRequest
    {
        public string IpAddress { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }
    }
}
