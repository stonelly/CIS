using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model.Response
{
    public class AuthResponse
    {
        public string ResponseCode { get; set; }
        public string ResponseMessage { get; set; }
        public AuthDataReponse Data { get; set; }
    }

    public class AuthDataReponse
    {
        public string Token { get; set; }
        public DateTime TokenExpiry { get; set; }
        public string base64img { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string UserId { get; set; }
        public string RoleId { get; set; }
        public string Location { get; set; }
        public int LocationId { get; set; }
        public List<TblBinLocationDTO> tblBinLocationDTO { get; set; }
        public List<LocationTypeDTO> LocationTypeDTOs { get; set; }
    }

    public class PlantMapping
    {
        public int Id { get; set; }
        public string Plant { get; set; }
        public bool IsEnable { get; set; }
    }

    public class UserAccountResponse
    {
        public long Id { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool IsDisabled { get; set; }
        public bool IsLocalAccount { get; set; }
        public List<string> Plant { get; set; }
        public string RoleName { get; set; }
        public long RoleId { get; set; }
    }

    //public class AuthSearchDataLineResponse
    //{
    //    public string Name { get; set; }
    //    public string Email { get; set; }
    //    public string UserId { get; set; }
    //}

    //public class AuthSearchDataResponse
    //{
    //    public string ResponseCode { get; set; }
    //    public string ResponseMessage { get; set; }
    //    public List<AuthSearchDataLineResponse> Data { get; set; }
    //}

    [Serializable]
    public class AuthSearchDataLineResponse
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string UserId { get; set; }
    }

    public class AuthSearchDataResponse
    {
        public string ResponseCode { get; set; }
        public string ResponseMessage { get; set; }
        public List<AuthSearchDataLineResponse> Data { get; set; }
    }
}
