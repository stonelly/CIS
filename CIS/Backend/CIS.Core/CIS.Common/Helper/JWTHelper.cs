using System;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CIS.Data.Model.Response;
using System.Security.Claims;
using CIS.Common.Constants;

namespace CIS.Common.Helper
{
    public static class JWTHelper
    {
        public static JwtDTO GetUserFromJWT(IHeaderDictionary header)
        {
            string auth = header["Authorization"];
            String[] token = auth.Split(AuthConst.TOKEN_SEPARATOR);

            var stream = token[1];
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(stream);
            var tokenS = handler.ReadToken(stream) as JwtSecurityToken;

            var name = tokenS.Claims.First(claim => claim.Type == "unique_name").Value;
            var locationInfo = tokenS.Claims.First(claim => claim.Type == ClaimTypes.Locality).Value;

            String[] location = locationInfo.Split(AuthConst.LOCATION_SEPARATOR);

            JwtDTO jwt = new JwtDTO();

            jwt.UserId = name;
            jwt.Token = token[1];

            if (location.Length > 1)
            {
                jwt.locationId = location[0];
                jwt.location = location[1];
                jwt.plant = location[2];
            }

            return jwt;
        }
    }
}
