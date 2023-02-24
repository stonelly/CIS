using System;
using AutoMapper;
using CIS.Core.Mapping;
using CIS.Data.Database;
using CIS.Services.Interface;
using CIS.Services.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace CIS.Core.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            //services.AddTransient<ILoginUserService, LoginUserService>();
            //services.AddTransient<IStockMasterService, StockMasterService>();

            services.AddCors();
            services.AddScoped<IEwareNaviService, EwareNaviService>();
            services.AddScoped<IInventory360Service, Inventory360Service>();
            services.AddScoped<IFloorSystemrService, FloorSystemrService>();
            services.AddScoped<ILogService, LogService>();
            
            // Auto Mapper Configurations
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);

            return services;
        }
    }
}
