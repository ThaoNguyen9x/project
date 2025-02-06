package com.building_mannager_system.entity.pament_entity;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stripe {
    private String status;
    private String message;
    private String sessionId;
    private String sessionUrl;
}
