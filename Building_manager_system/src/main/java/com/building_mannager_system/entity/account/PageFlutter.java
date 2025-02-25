package com.building_mannager_system.entity.account;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pages")
public class PageFlutter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String route;

    private String icon;

    private boolean status = true;

    @OneToMany(mappedBy = "page", fetch = FetchType.LAZY)
    private List<RolesPageFlutter> rolePages;
}
